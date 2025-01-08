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

func GetAllProduct() ([]models.AddProduct, error) {

	logger.LogInfo("GetAllProduct service :: started")
	resp, err := repo.GetAllProduct()
	if err != nil {
		return nil, err
	}
	logger.LogInfo("GetAllProduct service :: ending")
	return resp, nil
}

func GetSpecificProduct(id string) (*models.AddProduct, error) {

	logger.LogInfo("GetSpecificProduct service :: started")
	resp, err := repo.GetSpecificProduct(id)
	if err != nil {
		return nil, err
	}
	logger.LogInfo("GetSpecificProduct service :: ending")
	return resp, nil
}
