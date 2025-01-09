package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/utkarshpr/ecommerce/controllers"
	"github.com/utkarshpr/ecommerce/security"
)

func CartRoute(r *gin.Engine) {
	cart := r.Group("cart")

	cart.Use(security.GinAuthMiddleware())
	{
		cart.POST("/addToCart", func(c *gin.Context) {
			controllers.AddToCartController(c)
		})
	}
}
