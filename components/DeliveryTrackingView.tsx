'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShippingOrder, getShippingOrderByTrackingNumber } from '@/lib/localStorageUtils';
import { toast } from 'sonner';

export function DeliveryTrackingView() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<ShippingOrder | null>(null);

  const handleSearch = () => {
    if (!trackingNumber) {
      toast.error('운송장 번호를 입력해주세요.');
      return;
    }
    const order = getShippingOrderByTrackingNumber(trackingNumber);
    if (order) {
      setTrackingInfo(order);
      toast.success('운송장 정보를 조회했습니다.');
    } else {
      setTrackingInfo(null);
      toast.error('해당 운송장 번호의 정보를 찾을 수 없습니다.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>배송 추적</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="운송장 번호 입력"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>조회</Button>
        </div>
        {trackingInfo ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">주문 ID: {trackingInfo.orderId}</p>
              <p className="text-sm text-muted-foreground">상품명: {trackingInfo.productName}</p>
              <p className="text-sm text-muted-foreground">고객명: {trackingInfo.customerName}</p>
              <p className="text-lg font-semibold">현재 상태: {trackingInfo.status}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-md font-semibold mb-2">배송 이력</h3>
              {trackingInfo.trackingHistory.length > 0 ? (
                <ul className="space-y-2">
                  {trackingInfo.trackingHistory.map((event, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary mt-1" />
                      <div>
                        <p className="text-sm font-medium">{event.status}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()} - {event.location}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">배송 이력이 없습니다.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">운송장 번호를 입력하여 배송 정보를 조회하세요.</p>
        )}
      </CardContent>
    </Card>
  );
}
