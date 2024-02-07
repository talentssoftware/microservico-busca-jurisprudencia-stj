export class ResponseJstsDto {
  constructor(data: any) {
    this.title = data.title;
    this.code = data.code;
  }

  title: string;
  code: string;
}
