'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShippingPendingTable } from '@/components/ShippingPendingTable';
import { TrackingNumberGenerator } from '@/components/TrackingNumberGenerator';
import { ShippingStatusUpdater } from '@/components/ShippingStatusUpdater';
import { DeliveryTrackingView } from '@/components/DeliveryTrackingView';
import { ShippingOrder } from '@/lib/localStorageUtils';
import { Toaster } from 'sonner';

export default function ShippingPage() {
  const [selectedOrders, setSelectedOrders] = useState<ShippingOrder[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">배송 자동화</h2>
      </div>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">배송 대기 목록</TabsTrigger>
          <TabsTrigger value="tracking">배송 추적</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>배송 대기 목록</CardTitle>
              <CardDescription>
                주문된 상품의 배송 정보를 관리하고 운송장 번호를 생성/연동합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex space-x-2">
                <TrackingNumberGenerator selectedOrders={selectedOrders} onUpdate={handleRefresh} />
                <ShippingStatusUpdater selectedOrders={selectedOrders} onUpdate={handleRefresh} />
              </div>
              <ShippingPendingTable onSelectionChange={setSelectedOrders} refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tracking" className="space-y-4">
          <DeliveryTrackingView />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
