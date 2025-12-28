import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLeaves, updateLeaveStatus } from "@/api/leave.api";
import { successAlert, errorAlert } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, CheckCircle, XCircle } from "lucide-react";

const HRDashboard = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await getAllLeaves();
      setLeaves(res.data);
    } catch (err) {
      errorAlert("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateLeaveStatus(id, { status: "APPROVED" });
      successAlert("Leave approved!");
      fetchLeaves();
    } catch (err) {
      errorAlert("Failed to approve leave");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateLeaveStatus(id, { status: "REJECTED" });
      successAlert("Leave rejected!");
      fetchLeaves();
    } catch (err) {
      errorAlert("Failed to reject leave");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "ALL") return true;
    return leave.status === filter;
  });

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "PENDING").length,
    approved: leaves.filter((l) => l.status === "APPROVED").length,
    rejected: leaves.filter((l) => l.status === "REJECTED").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Leave<span className="text-blue-600">MS</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">HR Dashboard</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Leaves</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-blue-600 text-xl">📋</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <div className="text-yellow-600 text-xl">⏳</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-green-600 text-xl">✓</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <div className="text-red-600 text-xl">✗</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? "default" : "outline"}
              className={`${
                filter === status
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-slate-300"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Leaves Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Leave Requests {filter !== "ALL" && `- ${filter}`}
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <p>Loading...</p>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg mb-2">No leaves found</p>
              <p className="text-sm">
                {filter === "ALL"
                  ? "No leave requests yet"
                  : `No ${filter.toLowerCase()} leaves yet`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">
                      Employee Name
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Leave Type
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Start Date
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      End Date
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Reason
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves.map((leave) => (
                    <TableRow
                      key={leave.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {leave.employeeName || "N/A"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {leave.leave_type}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(leave.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(leave.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-xs truncate">
                        {leave.reason}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(leave.status)}>
                          {leave.status || "PENDING"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {leave.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApprove(leave.id)}
                                className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded transition"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReject(leave.id)}
                                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {leave.status !== "PENDING" && (
                            <span className="text-slate-400 text-sm">
                              {leave.status === "APPROVED" ? "Approved" : "Rejected"}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;
