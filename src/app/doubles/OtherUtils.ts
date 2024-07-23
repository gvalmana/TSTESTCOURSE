import { v4 } from 'uuid';

export type stringInfo = {
  lowerCase: string;
  upperCase: string;
  characters: string[];
  length: number;
  extraInfo: Object | undefined;
};

type LoggerServiceCallBack = (arg: string) => void;

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function toLowerCaseWihId(str: string): string {
  return str.toLowerCase() + v4();
}

export function calculateComplexity(stringInfo: stringInfo): number {
  return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

export function toUpperCaseWithCB(
  str: string,
  callback: LoggerServiceCallBack,
): void | string {
  if (!str) {
    callback('Invalid argument');
    return;
  }
  callback(`Called fuction with ${str}`);
  return str.toUpperCase();
}

export class OtherStringUtils {
  private callExternalService(): void {
    console.log('Calling external service!!!');
  }

  public toUpperCase(str: string): string {
    return str.toUpperCase();
  }

  public logString(str: string): void {
    console.log(str);
  }
}
