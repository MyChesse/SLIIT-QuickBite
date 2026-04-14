import AdminSidebar from './AdminSidebar';

const AdminSidebarLayout = ({ children, activePage = '', contentClassName = 'px-4 py-8 sm:px-6 lg:px-8' }) => {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
        <AdminSidebar activePage={activePage} />
        <main className={`flex-1 ${contentClassName}`}>{children}</main>
      </div>
    </div>
  );
};

export default AdminSidebarLayout;
