'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShippingOrder, updateShippingOrder } from '@/lib/localStorageUtils';
import { toast } from 'sonner';

interface TrackingNumberGeneratorProps {
  selectedOrders: ShippingOrder[];
  onUpdate: () => void;
}

export function TrackingNumberGenerator({ selectedOrders, onUpdate }: TrackingNumberGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualTrackingNumber, setManualTrackingNumber] = useState('');

  const generateRandomTrackingNumber = () => {
    const prefix = 'TRK';
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  const handleGenerateAndAssign = () => {
    if (selectedOrders.length === 0) {
      toast.error('운송장 번호를 생성할 주문을 선택해주세요.');
      return;
    }

    selectedOrders.forEach(order => {
      const newTrackingNumber = manualTrackingNumber || generateRandomTrackingNumber();
      const updatedOrder: ShippingOrder = {
        ...order,
        trackingNumber: newTrackingNumber,
        status: '운송장 생성됨',
        shippingDate: new Date().toISOString().split('T')[0],
        trackingHistory: [
          ...order.trackingHistory,
          {
            timestamp: new Date().toISOString(),
            status: '운송장 생성',
            location: '시스템',
          },
        ],
      };
      updateShippingOrder(updatedOrder);
    });
    toast.success(`${selectedOrders.length}개 주문에 운송장 번호가 할당되었습니다.`);
    setManualTrackingNumber('');
    setIsOpen(false);
    onUpdate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={selectedOrders.length === 0}>운송장 번호 생성/연동</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>운송장 번호 생성/연동</DialogTitle>
          <DialogDescription>
            선택된 {selectedOrders.length}개 주문에 운송장 번호를 할당합니다.
            자동 생성하거나 직접 입력할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manualTracking" className="text-right">
              수동 입력
            </Label>
            <Input
              id="manualTracking"
              value={manualTrackingNumber}
              onChange={(e) => setManualTrackingNumber(e.target.value)}
              className="col-span-3"
              placeholder="선택 시 모든 주문에 동일하게 적용"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleGenerateAndAssign}>
            {manualTrackingNumber ? '운송장 번호 할당' : '자동 생성 및 할당'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
