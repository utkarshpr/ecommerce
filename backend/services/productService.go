package services

import (
	"errors"
	"mime/multipart"

	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	repo "github.com/utkarshpr/ecommerce/repositary"
)

func AddProduct(product *models.AddProduct, files []*multipart.FileHeader) error {
	logger.LogInfo("AddProduct Service :: started")
	//cloudinary

	err := repo.AddProduct(product, files)
	if err != nil {
		logger.LogError("Failed to add Product" + err.Error())
		return errors.New("unable to upload Product" + err.Error())
	}
	logger.LogInfo("AddProduct Service :: ending")
	return nil
}
