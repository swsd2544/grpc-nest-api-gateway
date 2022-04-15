import { AuthGuard } from './../auth/auth.guard';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ProductServiceClient,
  PRODUCT_SERVICE_NAME,
  CreateProductRequest,
  CreateProductResponse,
  FindOneResponse,
} from './product.pb';
import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Controller('product')
export class ProductController {
  private svc: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private async createProduct(
    @Body() body: CreateProductRequest,
  ): Promise<Observable<CreateProductResponse>> {
    return this.svc.createProduct(body);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  private findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<FindOneResponse> {
    return this.svc.findOne({ id });
  }
}
