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
