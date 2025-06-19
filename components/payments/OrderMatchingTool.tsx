'use client';

import {useState,useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Badge} from '@/components/ui/badge';

interface Payment {
  id:string;
  amount:number;
  depositor:string;
  bank:string;
  date:string;
  status:'unconfirmed'|'matched'|'completed';
  matchedOrderId?:string;
}

interface Order {
  id:string;
  amount:number;
  customer:string;
  status:'pending_payment'|'payment_completed'|'processing';
  description:string;
}

interface OrderMatchingToolProps {
  selectedPayment:Payment|null;
  orders:Order[];
  onMatchOrder:(paymentId:string,orderId:string) => void;
  onConfirmPayment:(paymentId:string,orderId:string) => void;
}

export function OrderMatchingTool({
  selectedPayment,
  orders,
  onMatchOrder,
  onConfirmPayment
}:OrderMatchingToolProps) {
  const [isDialogOpen,setIsDialogOpen]=useState(false);
  const [searchTerm,setSearchTerm]=useState('');
  const [selectedOrder,setSelectedOrder]=useState<Order|null>(null);

  useEffect(() => {
    if(!selectedPayment) {
      setIsDialogOpen(false);
      setSelectedOrder(null);
      setSearchTerm('');
    } else if(selectedPayment.status === 'matched' && selectedPayment.matchedOrderId) {
      const matchedOrder=orders.find(o => o.id === selectedPayment.matchedOrderId);
      setSelectedOrder(matchedOrder || null);
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(true);
      setSelectedOrder(null);
      setSearchTerm('');
    }
  },[selectedPayment,orders]);

  const filteredOrders=orders.filter(
    order =>
      order.status === 'pending_payment' &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMatchAndConfirm = () => {
    if(selectedPayment && selectedOrder) {
      onMatchOrder(selectedPayment.id,selectedOrder.id);
      onConfirmPayment(selectedPayment.id,selectedOrder.id);
      setIsDialogOpen(false);
    }
  };

  const handleMatchOnly = () => {
    if(selectedPayment && selectedOrder) {
      onMatchOrder(selectedPayment.id,selectedOrder.id);
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!selectedPayment || selectedPayment.status === 'completed'}
          className="w-fullmd:w-auto"
        >
          {selectedPayment ? `${selectedPayment.depositor} 입금 매칭` : '입금 내역을 선택하세요'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]p-6">
        <DialogHeader>
          <DialogTitle className="text-2xlfont-bold">주문 매칭 및 결제 처리</DialogTitle>
          <DialogDescription className="text-gray-600">
            선택된 입금 내역에 해당하는 주문을 찾아 매칭하고 결제를 완료합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="gridgap-4py-4">
          {selectedPayment && (
            <Card className="mb-4bg-blue-50border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">선택된 입금 내역</CardTitle>
                <CardDescription>{selectedPayment.depositor} ({selectedPayment.bank})</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xlfont-semiboldtext-blue-700">{selectedPayment.amount.toLocaleString()}원</p>
                <p className="text-smtext-gray-600">입금일: {selectedPayment.date}</p>
                <Badge
                  variant={selectedPayment.status === 'unconfirmed' ? 'destructive' : selectedPayment.status === 'matched' ? 'default' : 'secondary'}
                  className="mt-2"
                >
                  {selectedPayment.status === 'unconfirmed' ? '미확인' : selectedPayment.status === 'matched' ? '매칭됨' : '완료'}
                </Badge>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="order-search">주문 검색</Label>
            <Input
              id="order-search"
              placeholder="주문 ID, 고객명, 상품명으로 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>매칭 가능한 주문 목록</Label>
            <ScrollArea className="h-[200px]w-fullrounded-mdborderp-4">
              {filteredOrders.length === 0 ? (
                <p className="text-centertext-gray-500">검색 결과가 없습니다.</p>
              ) : (
                filteredOrders.map(order => (
                  <Card
                    key={order.id}
                    className={`mb-2cursor-pointer${selectedOrder?.id === order.id ? 'border-blue-500bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardHeader className="p-3pb-0">
                      <CardTitle className="text-base">주문 ID: {order.id}</CardTitle>
                      <CardDescription className="text-sm">고객: {order.customer}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3pt-0">
                      <p className="text-smfont-semiboldtext-gray-800">{order.amount.toLocaleString()}원</p>
                      <p className="text-xstext-gray-600">{order.description}</p>
                      <Badge variant="outline" className="mt-1">
                        {order.status === 'pending_payment' ? '결제 대기' : '결제 완료'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </ScrollArea>
          </div>

          {selectedOrder && (
            <Card className="mt-4bg-green-50border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">선택된 매칭 주문</CardTitle>
                <CardDescription>주문 ID: {selectedOrder.id} / 고객: {selectedOrder.customer}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xlfont-semiboldtext-green-700">{selectedOrder.amount.toLocaleString()}원</p>
                <p className="text-smtext-gray-600">{selectedOrder.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
        <DialogFooter className="flexflex-colsm:flex-rowsm:justify-endgap-2">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            취소
          </Button>
          <Button
            variant="secondary"
            onClick={handleMatchOnly}
            disabled={!selectedPayment || !selectedOrder || selectedPayment.status === 'completed'}
          >
            주문 매칭만
          </Button>
          <Button
            onClick={handleMatchAndConfirm}
            disabled={!selectedPayment || !selectedOrder || selectedPayment.status === 'completed'}
          >
            결제 완료 처리
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
