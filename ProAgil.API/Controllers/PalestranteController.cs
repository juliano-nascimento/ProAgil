using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalestranteController : ControllerBase
    {
        private readonly IProAgilRepository _repository;

        public PalestranteController(IProAgilRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("getByName/{name}")]
        public async Task<IActionResult> Get(string name)
        {
            try
            {
                var results =
                    await _repository.GetAllPalestranteAsyncByName(name);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                "Banco de dados falhou");
            }
        }

        [HttpGet("PalestranteId")]
        public async Task<IActionResult> Get(int PalestranteId)
        {
            try
            {
                var palestrante =
                    await _repository.GetAllPalestranteAsyncById(PalestranteId);

                return Ok(palestrante);
            }
            catch (System.Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                "Banco de dados falhou");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Palestrante model)
        {
            try
            {
                _repository.Add (model);

                if (await _repository.SaveChangesAsync())
                {
                    return Created($"/api/Palestrante/{model.Id}", model);
                }
            }
            catch (System.Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                "Banco de dados falhou");
            }

            return BadRequest();
        }

        [HttpPut]
        public async Task<IActionResult> Put(int PalestranteId, Palestrante model)
        {
            try
            {
                var palestrante = await _repository.GetAllPalestranteAsyncById(PalestranteId);
                if (palestrante == null) return NotFound();

                _repository.Update (model);

                if (await _repository.SaveChangesAsync())
                {
                    return Created($"/api/Palestrante/{model.Id}", model);
                }
            }
            catch (System.Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                "Banco de dados falhou");
            }

            return BadRequest();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int PalestranteId)
        {
            try
            {
                var palestrante = await _repository.GetAllPalestranteAsyncById(PalestranteId);
                if (palestrante == null) return NotFound();

                _repository.Delete(palestrante);

                if(await _repository.SaveChangesAsync())
                    return Ok();
            }
            catch (System.Exception)
            {
               return StatusCode(StatusCodes.Status500InternalServerError,
                "Banco de dados falhou");
            }

            return BadRequest();
        }
    }
}
