package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/utkarshpr/ecommerce/controllers"
	"github.com/utkarshpr/ecommerce/security"
)

func AuthRoutes(r *gin.Engine) {
	auth := r.Group("/auth")
	{
		// Wrapping SignUpController to work with Gin's gin.Context
		auth.POST("/signup", func(c *gin.Context) {

			// Call SignUpController with ResponseWriter and Request
			controllers.SignUpController(c.Writer, c.Request)
		})
		// Uncomment and modify the following if needed
		auth.POST("/login", func(c *gin.Context) {

			// Call SignUpController with ResponseWriter and Request
			controllers.LoginController(c.Writer, c.Request)
		})
		auth.Use(security.GinAuthMiddleware())
		{
			auth.POST("/logout", func(c *gin.Context) {

				// Call SignUpController with ResponseWriter and Request
				controllers.LogoutController(c)
			})
			auth.GET("getUserData", func(c *gin.Context) {
				controllers.GetLoggedinUserData(c)
			})
			auth.PATCH("update", func(c *gin.Context) {
				controllers.UpdateLoggedInUser(c)
			})

		}

	}
}
