package repo

import (
	"context"
	"time"

	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddtoCart(cartItem *models.AddToCart) error {
	logger.LogInfo("AddtoCart repo:: started ")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// Check if cart for user already exists
	var existingCart models.AddToCart
	err := cartCollection.FindOne(ctx, bson.M{"for_user": cartItem.ForUser}).Decode(&existingCart)
	if err != nil && err != mongo.ErrNoDocuments {
		// If we get an error other than "no document", log and return the error
		logger.LogError("Error finding existing cart: " + err.Error())
		return err
	}

	// If cart exists, update it, otherwise, create a new one
	if err == mongo.ErrNoDocuments {
		// No cart exists for the user, create a new one
		cartItem.AddedAt = time.Now().Format(time.RFC3339) // Set the current timestamp
		_, err := cartCollection.InsertOne(ctx, cartItem)
		if err != nil {
			logger.LogError("Error inserting new cart: " + err.Error())
			return err
		}
	} else {
		// Cart exists, update it
		update := bson.M{
			"$push": bson.M{"orders": bson.M{"$each": cartItem.Orders}},
			"$set":  bson.M{"added_at": time.Now().Format(time.RFC3339)}, // Update the timestamp
		}
		_, err = cartCollection.UpdateOne(ctx, bson.M{"for_user": cartItem.ForUser}, update)
		if err != nil {
			logger.LogError("Error updating existing cart: " + err.Error())
			return err
		}
	}

	logger.LogInfo("AddtoCart repo:: end ")
	return nil
}
