using EAuction.APIGateway.Models;
using EAuction.APIGateway.Repositories.Abstractions;
using EAuction.APIGateway.Services;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace APIGateway.Controllers
{   
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        #region Variables

        private IUserRepository _userRepository;

        #endregion
        #region Constructor
        public AuthController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        #endregion

       
        [HttpPost("validateuser")]
        [ProducesResponseType(Microsoft.AspNetCore.Http.StatusCodes.Status200OK)]
        [ProducesResponseType(Microsoft.AspNetCore.Http.StatusCodes.Status409Conflict)]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateUser([FromBody] User user)
        {
            var _user = await _userRepository.GetUser(user.Email, user.Password);

            if (_user != null)
            {
                _user.Password = null;
                _user.Token = new AuctionTokenService().GenerateToken(_user).Token;
            }
            else
            {
                return Ok(new Error() { StatusCode = 400, ErrorMessage = "Invalid Credentials" });
            }

            return Ok(_user);
        }

        [HttpPost]
        [Route("createuser")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            User newUser = await _userRepository.Create(user);     
            
            if (newUser == null)
            {
                return Ok(new Error() { StatusCode = 400, ErrorMessage = "Email already exist!" });
            }

            user.Token = new AuctionTokenService().GenerateToken(user).Token;
            return Ok(user);
        }
    }
}
