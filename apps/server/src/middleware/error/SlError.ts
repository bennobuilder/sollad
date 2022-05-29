export default class SlError {
  public readonly message: string;
  public readonly status: number;
  public readonly additionalInfo: AdditionalInfoType;

  constructor(
    message: string,
    status = 500,
    additionalInfo: AdditionalInfoType = null,
  ) {
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}

export type AdditionalInfoType = { [key: string]: any } | null;
