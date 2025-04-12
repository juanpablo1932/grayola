function unauthorizedPage() {
  return ( 
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-cyan-500">Unauthorized</h1>
      <p className="mt-4 text-lg text-gray-700">You do not have permission to access this page.</p>
    </div>
   );
}

export default unauthorizedPage;