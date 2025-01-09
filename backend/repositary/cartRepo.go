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

// func AddtoCart(cartItem *models.AddToCart) error {
// 	logger.LogInfo("AddtoCart repo:: started ")
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()
// 	// Check if cart for user already exists
// 	var existingCart models.AddToCart
// 	err := cartCollection.FindOne(ctx, bson.M{"for_user": cartItem.ForUser}).Decode(&existingCart)
// 	if err != nil && err != mongo.ErrNoDocuments {
// 		// If we get an error other than "no document", log and return the error
// 		logger.LogError("Error finding existing cart: " + err.Error())
// 		return err
// 	}

// 	// If cart exists, update it, otherwise, create a new one
// 	if err == mongo.ErrNoDocuments {
// 		// No cart exists for the user, create a new one
// 		cartItem.AddedAt = time.Now().Format(time.RFC3339) // Set the current timestamp
// 		_, err := cartCollection.InsertOne(ctx, cartItem)
// 		if err != nil {
// 			logger.LogError("Error inserting new cart: " + err.Error())
// 			return err
// 		}
// 	} else {
// 		// Cart exists, update it
// 		update := bson.M{
// 			"$push": bson.M{"orders": bson.M{"$each": cartItem.Orders}},
// 			"$set":  bson.M{"added_at": time.Now().Format(time.RFC3339)}, // Update the timestamp
// 		}
// 		_, err = cartCollection.UpdateOne(ctx, bson.M{"for_user": cartItem.ForUser}, update)
// 		if err != nil {
// 			logger.LogError("Error updating existing cart: " + err.Error())
// 			return err
// 		}
// 	}

//		logger.LogInfo("AddtoCart repo:: end ")
//		return nil
//	}
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

// func AddtoCart(cartItem *models.AddToCart) error {
// 	logger.LogInfo("AddtoCart repo:: started")
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()

// 	// Normalize existing cart data with aggregation
// 	pipeline := bson.A{
// 		bson.M{
// 			"$match": bson.M{"for_user": cartItem.ForUser},
// 		},
// 		bson.M{
// 			"$project": bson.M{
// 				"for_user": "$for_user",
// 				"added_at": "$added_at",
// 				"orders": bson.M{
// 					"$map": bson.M{
// 						"input": "$orders",
// 						"as":    "order",
// 						"in": bson.M{
// 							"product_id":              "$$order.product_id",
// 							"quantity":                bson.M{"$toString": "$$order.quantity"}, // Convert quantity to string
// 							"is_special_request":      "$$order.is_special_request",
// 							"special_request_details": "$$order.special_request_details",
// 						},
// 					},
// 				},
// 			},
// 		},
// 	}

// 	// Perform aggregation query
// 	cursor, err := cartCollection.Aggregate(ctx, pipeline)
// 	if err != nil {
// 		logger.LogError("Error finding existing cart with normalized data: " + err.Error())
// 		return err
// 	}

// 	var normalizedCart []models.AddToCart
// 	if err = cursor.All(ctx, &normalizedCart); err != nil {
// 		logger.LogError("Error decoding normalized cart data: " + err.Error())
// 		return err
// 	}

// 	// Check if a cart exists
// 	if len(normalizedCart) == 0 {
// 		// No cart exists for the user, create a new one
// 		cartItem.AddedAt = time.Now().Format(time.RFC3339) // Set the current timestamp
// 		_, err := cartCollection.InsertOne(ctx, cartItem)
// 		if err != nil {
// 			logger.LogError("Error inserting new cart: " + err.Error())
// 			return err
// 		}
// 	} else {
// 		// Cart exists, update it
// 		update := bson.M{
// 			"$push": bson.M{"orders": bson.M{"$each": cartItem.Orders}},
// 			"$set":  bson.M{"added_at": time.Now().Format(time.RFC3339)}, // Update the timestamp
// 		}
// 		_, err = cartCollection.UpdateOne(ctx, bson.M{"for_user": cartItem.ForUser}, update)
// 		if err != nil {
// 			logger.LogError("Error updating existing cart: " + err.Error())
// 			return err
// 		}
// 	}

// 	logger.LogInfo("AddtoCart repo:: end")
// 	return nil
// }
