'use client';

import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
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

interface UnconfirmedPaymentsTableProps {
  payments:Payment[];
  onSelectPayment:(paymentId:string) => void;
  selectedPaymentId:string|null;
}

export function UnconfirmedPaymentsTable({
  payments,
  onSelectPayment,
  selectedPaymentId
}:UnconfirmedPaymentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-fullbg-whiteborderborder-gray-200rounded-lg">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[100px]text-leftfont-semiboldtext-gray-700">선택</TableHead>
            <TableHead className="text-leftfont-semiboldtext-gray-700">입금자</TableHead>
            <TableHead className="text-leftfont-semiboldtext-gray-700">은행</TableHead>
            <TableHead className="text-rightfont-semiboldtext-gray-700">금액</TableHead>
            <TableHead className="text-leftfont-semiboldtext-gray-700">입금일</TableHead>
            <TableHead className="text-leftfont-semiboldtext-gray-700">상태</TableHead>
            <TableHead className="text-leftfont-semiboldtext-gray-700">매칭된 주문</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24text-centertext-gray-500">미확인 입금 내역이 없습니다.</TableCell>
            </TableRow>
          ) : (
            payments.map(payment => (
              <TableRow key={payment.id} className={selectedPaymentId === payment.id ? 'bg-blue-50' : ''}>
                <TableCell>
                  <Button
                    variant={selectedPaymentId === payment.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSelectPayment(payment.id)}
                    disabled={payment.status === 'completed'}
                  >
                    {selectedPaymentId === payment.id ? '선택됨' : '선택'}
                  </Button>
                </TableCell>
                <TableCell className="font-mediumtext-gray-800">{payment.depositor}</TableCell>
                <TableCell className="text-gray-700">{payment.bank}</TableCell>
                <TableCell className="text-rightfont-mediumtext-gray-800">{payment.amount.toLocaleString()}원</TableCell>
                <TableCell className="text-gray-700">{payment.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={payment.status === 'unconfirmed' ? 'destructive' : payment.status === 'matched' ? 'default' : 'secondary'}
                  >
                    {payment.status === 'unconfirmed' ? '미확인' : payment.status === 'matched' ? '매칭됨' : '완료'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700">
                  {payment.matchedOrderId ? (
                    <Badge variant="outline">{payment.matchedOrderId}</Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
