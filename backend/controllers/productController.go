package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	"github.com/utkarshpr/ecommerce/services"
	"github.com/utkarshpr/ecommerce/validation"
)

func AddProductController(c *gin.Context) {
	logger.LogInfo("AddProductController :: starting")
	if c.Request.Method != "POST" {
		logger.LogError("AddProductController :: Method required is POST")
		models.ManageResponse(c.Writer, "POST Method is Required", http.StatusBadRequest, nil, false)
		return
	}
	userClaims, exists := c.Get("user")
	if !exists {
		logger.LogError("AddProductController :: unauthorized..")
		models.ManageResponse(c.Writer, "Unauthorized", http.StatusUnauthorized, nil, false)
		return
	}

	claims, ok := userClaims.(jwt.MapClaims)
	if !ok {
		logger.LogError("AddProductController :: unable to process claim")
		models.ManageResponse(c.Writer, "Unable to process claim", http.StatusUnauthorized, nil, false)
		return
	}
	role := claims["role"]
	if role == "ADMIN" {
		logger.LogInfo("AddProductController :: ADMIN role adding the product")
		var product models.AddProduct

		// decoder := json.NewDecoder(c.Request.Body)
		// err := decoder.Decode(&product)
		// if err != nil {
		// 	logger.LogError("AddProductController :: error in decoding the body")
		// 	models.ManageResponse(c.Writer, "error in decoding the body", http.StatusBadRequest, nil, false)
		// 	return
		// }

		//var product models.AddProduct
		if err := c.ShouldBind(&product); err != nil {
			logger.LogError("LoginController :: invalid input" + err.Error())
			models.ManageResponse(c.Writer, "Invalid input ", http.StatusBadRequest, nil, false)
			return
		}

		// validation
		err := validation.ValidationAddProduct(&product)
		if err != nil {
			logger.LogError("LoginController :: error in validation  " + err.Error())
			models.ManageResponse(c.Writer, "Error : "+err.Error(), http.StatusBadRequest, nil, false)
			return
		}
		//media
		//media
		// Retrieve files from the "images" field
		files := c.Request.MultipartForm.File["images"]
		if len(files) == 0 {
			logger.LogInfo("No media files uploaded")
			c.JSON(http.StatusBadRequest, gin.H{"error": "No media files uploaded"})
			return
		}
		err = services.AddProduct(&product, files)
		if err != nil {
			logger.LogError(err.Error())
			models.ManageResponse(c.Writer, err.Error(), http.StatusBadRequest, nil, false)
			return
		}
		models.ManageResponse(c.Writer, "Product added Successfully ", http.StatusOK, nil, true)

	} else {
		logger.LogError("AddProductController :: ADMIN role is required for adding the product")
		models.ManageResponse(c.Writer, "ADMIN role is required for adding the product", http.StatusBadRequest, nil, false)
	}
	logger.LogInfo("AddProductController :: ending")
}
