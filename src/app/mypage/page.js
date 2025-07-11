import Head from 'next/head';
import BottomNavigation from '@/components/BottomNavigation';

export default function MyPage() {
  const coupons = [
    { name: '제주 감귤 체험장', discount: '20%', points: 500 },
    { name: '해녀 박물관', discount: '무료입장', points: 300 },
    { name: '제주 전통차 카페', discount: '30%', points: 400 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>마이페이지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">마이페이지</h1>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">🎁</span>
            쿠폰 교환하기
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {coupons.map((coupon, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">{coupon.name}</h4>
                    <p className="text-sm text-gray-600">{coupon.discount} 할인</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{coupon.points}P</p>
                    <button className="mt-1 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium hover:bg-orange-600 transition-colors">
                      교환하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 내비게이션 */}
        <BottomNavigation />

      </div>
    </div>
  );
}
