import Sidebar from "../components/sideBar";
import Header from "../components/header";

export default function AdminDashboard() {
  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-[#141313] text-white">
        <Header />

        <section className="p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-md">
              <h2 className="text-gray-400 text-sm mb-2">Total Products</h2>
              <p className="text-2xl font-semibold">120</p>
            </div>
            <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-md">
              <h2 className="text-gray-400 text-sm mb-2">Total Orders</h2>
              <p className="text-2xl font-semibold">305</p>
            </div>
            <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-md">
              <h2 className="text-gray-400 text-sm mb-2">Registered Users</h2>
              <p className="text-2xl font-semibold">89</p>
            </div>
          </div>

          <div className="mt-10 bg-[#1E1E1E] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3">Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700 hover:bg-[#2A2A2A] transition">
                  <td className="py-3">#ORD-101</td>
                  <td>John Doe</td>
                  <td><span className="text-green-400">Completed</span></td>
                  <td>$150</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-[#2A2A2A] transition">
                  <td className="py-3">#ORD-102</td>
                  <td>Jane Smith</td>
                  <td><span className="text-yellow-400">Pending</span></td>
                  <td>$89</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
