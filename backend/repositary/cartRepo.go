package repo

import (
	"context"
	"strconv"
	"time"

	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func AddtoCart(cartItem *models.AddToCart) error {
	logger.LogInfo("AddtoCart repo:: started")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Fetch the existing cart for the user
	var existingCart models.AddToCart
	err := cartCollection.FindOne(ctx, bson.M{"for_user": cartItem.ForUser}).Decode(&existingCart)
	if err != nil && err != mongo.ErrNoDocuments {
		logger.LogError("Error finding existing cart: " + err.Error())
		return err
	}

	// Initialize a map to track product IDs and their indexes
	productIndexMap := make(map[string]int)
	for i, order := range existingCart.Orders {
		productIndexMap[order.ProductID] = i
	}

	logger.LogInfo(productIndexMap)
	// Merge new orders into existing ones
	for _, newOrder := range cartItem.Orders {
		if idx, exists := productIndexMap[newOrder.ProductID]; exists {
			// Product exists, update the quantity
			existingQty, _ := strconv.Atoi(existingCart.Orders[idx].Quantity)
			newQty, _ := strconv.Atoi(newOrder.Quantity)
			existingCart.Orders[idx].Quantity = strconv.Itoa(existingQty + newQty)
		} else {
			// Product doesn't exist, add it to the cart
			existingCart.Orders = append(existingCart.Orders, newOrder)
		}
	}

	// Update or insert the cart in the database
	update := bson.M{
		"$set": bson.M{
			"orders":   existingCart.Orders,
			"added_at": time.Now().Format(time.RFC3339),
		},
	}
	_, err = cartCollection.UpdateOne(ctx, bson.M{"for_user": cartItem.ForUser}, update, options.Update().SetUpsert(true))
	if err != nil {
		logger.LogError("Error updating cart: " + err.Error())
		return err
	}

	logger.LogInfo("AddtoCart repo:: end")
	return nil
}

func GetCartItems(username string) (*models.AddToCart, error) {
	logger.LogInfo("GetCartItems repo :: started")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Retrieve the cart document for the user
	var cart models.AddToCart
	err := cartCollection.FindOne(ctx, bson.M{"for_user": username}).Decode(&cart)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Return an empty cart if no cart exists for the user
			return &models.AddToCart{ForUser: username, Orders: []models.Order{}}, nil
		}
		logger.LogError("Error finding cart: " + err.Error())
		return nil, err
	}

	logger.LogInfo("GetCartItems repo :: end")
	return &cart, nil
}
