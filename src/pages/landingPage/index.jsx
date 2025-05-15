import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-gray-100 text-gray-800 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Quản Lý Chi Tiêu Thông Minh
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-6">
          Ứng dụng giúp bạn theo dõi thu chi, đặt ngân sách và kiểm soát tài chính cá nhân một cách hiệu quả.
        </p>
        <a
          href="/sign-up"
          className="bg-white text-blue-500 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition"
        >
          Bắt đầu miễn phí
        </a>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 text-center">
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-teal-600 mb-2">Ghi chép thu chi</h3>
            <p>Thêm các khoản thu nhập và chi tiêu hàng ngày một cách nhanh chóng.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-teal-600 mb-2">Thống kê trực quan</h3>
            <p>Xem báo cáo thu chi theo tuần, tháng bằng biểu đồ sinh động.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-teal-600 mb-2">Đặt giới hạn chi tiêu</h3>
            <p>Thiết lập ngân sách cho từng mục tiêu và nhận cảnh báo khi vượt mức.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center bg-gray-800 text-gray-300 py-6 text-sm">
        © 2025 Quản Lý Chi Tiêu. Bảo mật và hiệu quả là ưu tiên hàng đầu.
      </footer>
    </div>
  );
};

export default LandingPage;
