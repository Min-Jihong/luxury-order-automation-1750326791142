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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ShippingOrder, updateShippingOrder } from '@/lib/localStorageUtils';
import { toast } from 'sonner';

interface ShippingStatusUpdaterProps {
  selectedOrders: ShippingOrder[];
  onUpdate: () => void;
}

export function ShippingStatusUpdater({ selectedOrders, onUpdate }: ShippingStatusUpdaterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ShippingOrder['status'] | ''>('');

  const statusOptions: ShippingOrder['status'][] = [
    '배송 대기',
    '운송장 생성됨',
    '배송 준비중',
    '배송 중',
    '배송 완료',
    '배송 취소',
  ];

  const handleUpdateStatus = () => {
    if (selectedOrders.length === 0) {
      toast.error('상태를 업데이트할 주문을 선택해주세요.');
      return;
    }
    if (!newStatus) {
      toast.error('새로운 상태를 선택해주세요.');
      return;
    }

    selectedOrders.forEach(order => {
      const updatedOrder: ShippingOrder = {
        ...order,
        status: newStatus,
        trackingHistory: [
          ...order.trackingHistory,
          {
            timestamp: new Date().toISOString(),
            status: `상태 변경: ${newStatus}`,
            location: '시스템',
          },
        ],
      };
      updateShippingOrder(updatedOrder);
    });
    toast.success(`${selectedOrders.length}개 주문의 상태가 "${newStatus}"(으)로 업데이트되었습니다.`);
    setNewStatus('');
    setIsOpen(false);
    onUpdate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={selectedOrders.length === 0}>배송 상태 업데이트</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>배송 상태 업데이트</DialogTitle>
          <DialogDescription>
            선택된 {selectedOrders.length}개 주문의 배송 상태를 변경합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="statusSelect" className="text-right">
              새로운 상태
            </Label>
            <Select onValueChange={(value: ShippingOrder['status']) => setNewStatus(value)} value={newStatus} >
              <SelectTrigger className="col-span-3" id="statusSelect">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateStatus} disabled={!newStatus}>상태 업데이트</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
