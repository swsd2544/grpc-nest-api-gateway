import { UserWithAuthRequest } from './../definitionFile';
import { AuthGuard } from './../auth/auth.guard';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderServiceClient,
  ORDER_SERVICE_NAME,
} from './order.pb';
import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

@Controller('order')
export class OrderController {
  private svc: OrderServiceClient;

  @Inject(ORDER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private createOrder(
    @Req() req: UserWithAuthRequest,
  ): Observable<CreateOrderResponse> {
    const body: CreateOrderRequest = req.body;

    body.userId = <number>req.user;

    return this.svc.createOrder(body);
  }
}
