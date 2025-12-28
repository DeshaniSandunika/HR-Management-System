import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applyLeave, getMyLeaves, deleteLeave } from "@/api/leave.api";
import { successAlert, errorAlert } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Trash2, Calendar } from "lucide-react";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getMyLeaves();
      setLeaves(res.data);
    } catch (err) {
      errorAlert("Failed to fetch leaves");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.leaveType) {
      newErrors.leaveType = "Leave type is required";
    }

    if (!form.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!form.endDate) {
      newErrors.endDate = "End date is required";
    } else if (new Date(form.endDate) < new Date(form.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!form.reason.trim()) {
      newErrors.reason = "Reason is required";
    } else if (form.reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await applyLeave(form);
      successAlert("Leave applied successfully!");
      setForm({ leaveType: "", startDate: "", endDate: "", reason: "" });
      setShowForm(false);
      fetchLeaves();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to apply leave";
      errorAlert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;

    try {
      await deleteLeave(id);
      successAlert("Leave deleted successfully!");
      fetchLeaves();
    } catch (err) {
      errorAlert("Failed to delete leave");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
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
            <span className="text-slate-600">Employee Dashboard</span>
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
        {/* Apply Leave Form */}
        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </Button>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Apply for Leave</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700 text-xl font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Leave Type
                </label>
                <Select
                  value={form.leaveType}
                  onValueChange={(value) => {
                    setForm({ ...form, leaveType: value });
                    if (errors.leaveType) setErrors({ ...errors, leaveType: "" });
                  }}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="CASUAL">Casual Leave</SelectItem>
                    <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                    <SelectItem value="MATERNITY">Maternity Leave</SelectItem>
                  </SelectContent>
                </Select>
                {errors.leaveType && (
                  <p className="text-red-500 text-sm mt-1">{errors.leaveType}</p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => {
                      setForm({ ...form, startDate: e.target.value });
                      if (errors.startDate) setErrors({ ...errors, startDate: "" });
                    }}
                    className="pl-10 border-slate-300"
                  />
                </div>
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => {
                      setForm({ ...form, endDate: e.target.value });
                      if (errors.endDate) setErrors({ ...errors, endDate: "" });
                    }}
                    className="pl-10 border-slate-300"
                  />
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>

              {/* Reason */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason
                </label>
                <Textarea
                  placeholder="Enter reason for leave"
                  value={form.reason}
                  onChange={(e) => {
                    setForm({ ...form, reason: e.target.value });
                    if (errors.reason) setErrors({ ...errors, reason: "" });
                  }}
                  className="border-slate-300"
                />
                {errors.reason && (
                  <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  {loading ? "Applying..." : "Apply Leave"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setForm({ leaveType: "", startDate: "", endDate: "", reason: "" });
                    setErrors({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Leaves Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">My Leaves</h2>
          </div>

          {leaves.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg mb-2">No leaves applied yet</p>
              <p className="text-sm">Click "Apply for Leave" to submit a leave request</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Type</TableHead>
                    <TableHead className="font-semibold text-slate-700">Start Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">End Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Reason</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-800">
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
                        <button
                          onClick={() => handleDelete(leave.id)}
                          className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

export default EmployeeDashboard;
