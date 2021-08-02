using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Local é de preenchimento obrigatorio")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Local é entre 3 e 100 caracteres" )]
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O tema é de preenchimento obrigatorio")]
        public string Tema { get; set; }

        [Range(2,120000, ErrorMessage = "Quantidade de pessoas é entre 2 e 120000")]
        public int QtdPessoas { get; set; }        
        public string ImagemURL { get; set; }

        [Phone(ErrorMessage = "Insira um numero de telefone válido")]
        public string Telefone { get; set; }

        [EmailAddress(ErrorMessage = "Insira um e-mail válido")]
        public string Email { get; set; }

        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}