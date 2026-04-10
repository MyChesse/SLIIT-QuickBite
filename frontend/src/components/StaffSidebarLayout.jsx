import SDStaffSidebar from './SDStaffSidebar';

const StaffSidebarLayout = ({ children, contentClassName = 'px-6 py-8 lg:px-8' }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SDStaffSidebar />
      <main className={`ml-64 flex-1 ${contentClassName}`}>{children}</main>
    </div>
  );
};

export default StaffSidebarLayout;
