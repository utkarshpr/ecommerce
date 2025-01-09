package services

import (
	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	repo "github.com/utkarshpr/ecommerce/repositary"
)

func AddToCart(cartData *models.AddToCart) error {
	logger.LogInfo("AddToCart service :: started")

	err := repo.AddtoCart(cartData)
	if err != nil {
		return err
	}
	logger.LogInfo("AddToCart service :: end")
	return nil
}

func GetCartItems(username string) (*models.AddToCart, error) {
	logger.LogInfo("GetCartItems service :: started")

	// Fetch the cart for the user from the repository
	cartData, err := repo.GetCartItems(username)
	if err != nil {
		return nil, err
	}

	logger.LogInfo("GetCartItems service :: end")
	return cartData, nil
}
