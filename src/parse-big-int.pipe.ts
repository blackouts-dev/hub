import { HttpStatus, Injectable, Optional, PipeTransform } from '@nestjs/common';
import { ErrorHttpStatusCode, HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

export interface ParseBigIntPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

/**
 * Defines the ParseBigInt Pipe
 */
@Injectable()
export class ParseBigIntPipe implements PipeTransform<string> {
  protected exceptionFactory: (error: string) => any;

  constructor(@Optional() options?: ParseBigIntPipeOptions) {
    options = options ?? {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } = options;

    this.exceptionFactory = exceptionFactory ?? ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  /**
   * Method that accesses and performs optional transformation on argument for in-flight requests.
   *
   * @param value Currently processed route argument
   */
  async transform(value: string): Promise<bigint> {
    try {
      return BigInt(value);
    } catch (error) {
      throw this.exceptionFactory('Validation failed (integer string is expected)');
    }
  }
}
