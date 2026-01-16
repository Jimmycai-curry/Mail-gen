/**
 * Spec: /docs/specs/admin-user-management.md
 * 
 * FluentWJ 管理后台 - 用户管理页面
 * 
 * Features:
 * - 用户列表展示（分页）
 * - 搜索功能（手机号/ID）
 * - 筛选功能（角色/状态）
 * - 启用/禁用账户
 * - 新增用户
 * - 导出用户数据
 */

"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/admin/users/UserTable";
import UserFilters from "@/components/admin/users/UserFilters";
import AddUserDialog from "@/components/admin/users/AddUserDialog";
import StatusConfirmDialog from "@/components/admin/users/StatusConfirmDialog";
import { UserListItem, UserListQuery } from "@/types/admin";

export default function UsersPage() {
  // ========== 状态管理 ==========
  
  // 用户列表数据
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 查询参数
  const [query, setQuery] = useState<UserListQuery>({
    page: 1,
    pageSize: 10,
    search: undefined,
    role: undefined,
    status: undefined,
  });

  // 对话框状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusDialogState, setStatusDialogState] = useState<{
    open: boolean;
    user: UserListItem | null;
    targetStatus: number;
  }>({
    open: false,
    user: null,
    targetStatus: 1,
  });


  // ========== 数据加载 ==========

  /**
   * 加载用户列表
   */
  const loadUsers = async () => {
    setLoading(true);
    try {
      // 构建查询字符串
      const params = new URLSearchParams({
        page: query.page.toString(),
        pageSize: query.pageSize.toString(),
      });

      if (query.search) {
        params.append("search", query.search);
      }
      if (query.role !== undefined) {
        params.append("role", query.role.toString());
      }
      if (query.status !== undefined) {
        params.append("status", query.status.toString());
      }

      // 获取 Token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      // 发送请求
      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("获取用户列表失败");
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setTotal(data.data.total);
      } else {
        console.error("获取用户列表失败:", data.error);
      }
    } catch (error) {
      console.error("加载用户列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时自动获取数据
  useEffect(() => {
    loadUsers();
  }, [query]);

  // ========== 事件处理 ==========

  /**
   * 搜索处理
   */
  const handleSearch = (search: string) => {
    setQuery({
      ...query,
      page: 1, // 搜索时重置到第一页
      search: search || undefined,
    });
  };

  /**
   * 筛选处理
   */
  const handleFilter = (role?: number, status?: number) => {
    setQuery({
      ...query,
      page: 1, // 筛选时重置到第一页
      role,
      status,
    });
  };

  /**
   * 分页处理
   */
  const handlePageChange = (page: number) => {
    setQuery({
      ...query,
      page,
    });
  };

  /**
   * 打开状态确认对话框
   */
  const handleOpenStatusDialog = (user: UserListItem, targetStatus: number) => {
    setStatusDialogState({
      open: true,
      user,
      targetStatus,
    });
  };

  /**
   * 关闭状态确认对话框
   */
  const handleCloseStatusDialog = () => {
    setStatusDialogState({
      open: false,
      user: null,
      targetStatus: 1,
    });
  };

  /**
   * 确认状态变更
   */
  const handleConfirmStatusChange = async () => {
    if (!statusDialogState.user) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `/api/admin/users/${statusDialogState.user.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: statusDialogState.targetStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("更新用户状态失败");
      }

      const data = await response.json();

      if (data.success) {
        // 刷新列表
        loadUsers();
        handleCloseStatusDialog();

        // 显示成功提示（可以集成 Toast 组件）
        alert(
          `用户 ${statusDialogState.user.phone} 已${
            statusDialogState.targetStatus === 0 ? "封禁" : "启用"
          }`
        );
      } else {
        alert(`操作失败: ${data.error}`);
      }
    } catch (error) {
      console.error("更新用户状态失败:", error);
      alert("更新用户状态失败，请稍后重试");
    }
  };

  /**
   * 新增用户成功回调
   */
  const handleUserAdded = () => {
    setIsAddDialogOpen(false);
    loadUsers();
  };

  /**
   * 导出用户数据
   */
  const handleExport = async () => {
    try {
      // 构建查询字符串
      const params = new URLSearchParams();

      if (query.search) {
        params.append("search", query.search);
      }
      if (query.role !== undefined) {
        params.append("role", query.role.toString());
      }
      if (query.status !== undefined) {
        params.append("status", query.status.toString());
      }

      // 获取 Token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      // 发送请求
      const response = await fetch(
        `/api/admin/users/export?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(`导出失败: ${data.error}`);
        return;
      }

      // 下载 CSV 文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("导出用户数据失败:", error);
      alert("导出失败，请稍后重试");
    }
  };

  // ========== 渲染 ==========

  return (
    <>
      {/* 页面内容 */}
      <div className="p-8 space-y-6">
        {/* 搜索与筛选栏 */}
        <UserFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
          onExport={handleExport}
          onAddUser={() => setIsAddDialogOpen(true)}
        />

        {/* 用户列表表格 */}
        <UserTable
          users={users}
          total={total}
          page={query.page}
          pageSize={query.pageSize}
          loading={loading}
          onPageChange={handlePageChange}
          onStatusChange={handleOpenStatusDialog}
        />
      </div>

      {/* 新增用户对话框 */}
      <AddUserDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleUserAdded}
      />

      {/* 状态确认对话框 */}
      <StatusConfirmDialog
        open={statusDialogState.open}
        user={statusDialogState.user}
        targetStatus={statusDialogState.targetStatus}
        onClose={handleCloseStatusDialog}
        onConfirm={handleConfirmStatusChange}
      />
    </>
  );
}
