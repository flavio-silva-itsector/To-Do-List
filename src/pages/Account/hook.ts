import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import type { SimpleUser, UsersStateStore } from "@/store";
import { useUsersStore } from "@/store";
import { PAGES } from "@/types/enums";

import { HTTPCodesMessage } from "./HTTPCodesMessage";

export default function useAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
  } as SimpleUser);

  const status = useUsersStore((state: UsersStateStore) => state.status);

  const createUser = useUsersStore((state: UsersStateStore) => state.create);
  const login = useUsersStore((state: UsersStateStore) => state.login);
  const clearStatus = useUsersStore(
    (state: UsersStateStore) => state.clearStatus
  );

  useEffect(() => {
    if (status) {
      const output = HTTPCodesMessage(status);
      Swal.fire({
        icon: output?.type,
        title: output?.title,
        text: output?.message,
      }).then(() => {
        if (status === "200") navigate(PAGES.HOME);
      });
    }

    return clearStatus;
  }, [clearStatus, navigate, status]);

  const onSubmitLogin = useCallback(() => {
    login(user);
  }, [login, user]);

  const onSubmitSingUp = useCallback(() => {
    createUser({ ...user });
  }, [createUser, user]);

  return {
    user,
    setUser,
    onSubmitLogin,
    onSubmitSingUp,
  };
}
