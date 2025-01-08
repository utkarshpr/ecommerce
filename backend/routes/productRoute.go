package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/utkarshpr/ecommerce/controllers"
	"github.com/utkarshpr/ecommerce/security"
)

func ProductRoute(r *gin.Engine) {
	auth := r.Group("/product")
	{
		auth.Use(security.GinAuthMiddleware())
		{
			auth.POST("/add", func(c *gin.Context) {
				controllers.AddProductController(c)
			})
		}
	}
}
