import { ApiProperty } from '@nestjs/swagger';

export class ResponseDataDto {
  constructor(data: any) {
    this.processo = data.processo;
    this.relator = data.relator;
    this.orgaoJulgador = data.orgaoJulgador;
    this.dataJulgamento = data.dataJulgamento;
    this.dataPublicacao = data.dataPublicacao;
    this.notas = data.notas;
    this.referenciaLegislativa = data.referenciaLegislativa;
    this.ementa = data.ementa;
    this.acordao = data.acordao;
  }

  @ApiProperty({ type: String })
  processo: string;

  @ApiProperty({ type: String })
  relator: string;

  @ApiProperty({ type: String })
  orgaoJulgador: string;

  @ApiProperty({ type: String })
  dataJulgamento: string;

  @ApiProperty({ type: String })
  dataPublicacao: string;

  @ApiProperty({ type: String })
  notas: string;

  @ApiProperty({ type: String })
  referenciaLegislativa: string;

  @ApiProperty({ type: String })
  ementa: string;

  @ApiProperty({ type: String })
  acordao: string;
}
