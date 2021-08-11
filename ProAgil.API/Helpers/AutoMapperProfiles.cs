using System.Linq;
using AutoMapper;
using ProAgil.API.Dtos;
using ProAgil.Domain;
using ProAgil.Domain.Identity;

namespace ProAgil.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>()
                .ForMember(dest => dest.Palestrantes, opt => {
                    opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Palestrantes).ToList());
                })
                .ReverseMap();
            CreateMap<Lote, LoteDto>()
                    .ReverseMap();
            CreateMap<Palestrante, PalestranteDto>()
                .ForMember(dest => dest.Eventos, opt => {
                    opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Eventos).ToList());
                })
                .ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>()
                .ReverseMap();
            CreateMap<User,UserDto>()
                .ReverseMap();
            CreateMap<User,UserLoginDto>()
                .ReverseMap();
        }
    }
}