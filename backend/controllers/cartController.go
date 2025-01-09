package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	"github.com/utkarshpr/ecommerce/services"
)

func AddToCartController(c *gin.Context) {

	logger.LogInfo("AddToCartController :: started")
	if c.Request.Method != "POST" {
		logger.LogError("AddToCartController :: POST method is required")
		models.ManageResponse(c.Writer, "POST method is required", http.StatusMethodNotAllowed, nil, false)
		return
	}

	var cartData *models.AddToCart

	decoder := json.NewDecoder(c.Request.Body)
	err := decoder.Decode(&cartData)
	if err != nil {
		logger.LogError("AddToCartController :: unable to decode" + err.Error())
		models.ManageResponse(c.Writer, "Unable to decode", http.StatusBadRequest, nil, false)
		return
	}

	userClaims, exists := c.Get("user")
	if !exists {
		logger.LogInfo("AddToCartController :: unauthorized..")
		models.ManageResponse(c.Writer, "Unauthorized", http.StatusUnauthorized, nil, false)
		return
	}

	claims, ok := userClaims.(jwt.MapClaims)
	if !ok {
		logger.LogInfo("AddToCartController :: unable to process claim")
		models.ManageResponse(c.Writer, "Unable to process claim", http.StatusUnauthorized, nil, false)
		return
	}
	username := claims["username"].(string)

	cartData.ForUser = username

	err = services.AddToCart(cartData)
	if err != nil {
		logger.LogError("AddToCartController :: unable to add to cart")
		models.ManageResponse(c.Writer, "Unable to add to cart", http.StatusBadRequest, nil, false)
		return
	}
	models.ManageResponse(c.Writer, "successfully added to cart !!", http.StatusOK, nil, true)
	logger.LogInfo("AddToCartController :: end")

}

func GetCartItemsController(c *gin.Context) {
	logger.LogInfo("GetCartItemsController :: started")

	// Check if the method is GET
	if c.Request.Method != "GET" {
		logger.LogError("GetCartItemsController :: GET method is required")
		models.ManageResponse(c.Writer, "GET method is required", http.StatusMethodNotAllowed, nil, false)
		return
	}

	// Retrieve user claims from the context
	userClaims, exists := c.Get("user")
	if !exists {
		logger.LogInfo("GetCartItemsController :: unauthorized..")
		models.ManageResponse(c.Writer, "Unauthorized", http.StatusUnauthorized, nil, false)
		return
	}

	claims, ok := userClaims.(jwt.MapClaims)
	if !ok {
		logger.LogInfo("GetCartItemsController :: unable to process claim")
		models.ManageResponse(c.Writer, "Unable to process claim", http.StatusUnauthorized, nil, false)
		return
	}
	username := claims["username"].(string)

	// Fetch cart items from the service
	cartData, err := services.GetCartItems(username)
	if err != nil {
		logger.LogError("GetCartItemsController :: unable to fetch cart items")
		models.ManageResponse(c.Writer, "Unable to fetch cart items", http.StatusBadRequest, nil, false)
		return
	}

	// Return cart data
	models.ManageResponse(c.Writer, "Cart items fetched successfully", http.StatusOK, cartData, true)
	logger.LogInfo("GetCartItemsController :: end")
}
