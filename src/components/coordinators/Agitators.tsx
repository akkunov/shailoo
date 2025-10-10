import { useEffect, useState } from "react";
import { useAgitatorsStore } from "@/store/agitatorsStore";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UIK, User } from "@/types/models";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuthStore } from "@/store/authStore";
import {api} from "@/api/axios.ts";

type EditableUser = User & { isEditing?: boolean };

export default function AgitatorsComponent() {
  const {
    fetchAgitators,
    createAgitator,
    updateAgitator,
    deleteAgitator,
    agitators,
    loading,
    error,
  } = useAgitatorsStore();

  const { user } = useAuthStore();
  const [editableUsers, setEditableUsers] = useState<EditableUser[]>([]);
  const [uiks, setUiks] = useState<UIK[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    pin: "",
    uiks: [] as string[],
  });

  useEffect(() => {
    // загрузка агитаторов
    fetchAgitators("agitators")
      .then(() => toast.success("Данные загружены"))
      .catch(() => toast.error("Ошибка загрузки агитаторов"));

    // загрузка УИК
    api.get('/uiks')
    .then(res => {
        setUiks(res.data)
    })
    .catch(() => toast.error("Ошибка загрузки УИКов"))
  }, []);

  useEffect(() => {
    setEditableUsers(agitators);
  }, [agitators]);

  const handleChange = (id: number, field: keyof User, value: string) => {
    setEditableUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const handleSave = async (user: EditableUser) => {
    try {
      await updateAgitator(user.id, {
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        phone: user.phone,
        pin: user.pin,
      });
      toast.success("Агитатор обновлён");
      setEditableUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isEditing: false } : u
        )
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Ошибка при обновлении");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить этого агитатора?")) return;
    try {
      await deleteAgitator(id);
        fetchAgitators('agitators')
      toast.success("Агитатор удалён");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Ошибка при удалении");
    }
  };

  const handleCreate = async () => {
    if (!user) return toast.error("Ошибка: пользователь не найден");

    try {

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim(),
        phone: form.phone.trim(),
        pin: form.pin.trim(),
          uiks: form.uiks.map((uik) => Number(uik)),
        coordinatorId: user.id,
      };


      await createAgitator(payload);
      toast.success("Агитатор добавлен");
      setForm({
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        pin: "",
        uiks: [],
      });
      await fetchAgitators("agitators");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Ошибка при добавлении");
    }
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );

  if (error)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="p-4">
      <Toaster />
      <Card className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">Добавить агитатора</h2>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Фамилия</Label>
            <Input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <div>
            <Label>Имя</Label>
            <Input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div>
            <Label>Отчество</Label>
            <Input
              value={form.middleName}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
            />
          </div>
          <div>
            <Label>Телефон</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label>PIN</Label>
            <Input
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value })}
            />
          </div>
          <div>
            <Label>Прикрепить к УИК</Label>
            <MultiSelect
              className="text-white hover:text-white"
              options={uiks.map((uik) => ({
                label: `${uik.code} — ${uik.name}`,
                value: `${uik.code}`,
              }))}
              selected={form.uiks}
              onChange={(values) => setForm({ ...form, uiks: values })}
              placeholder="Выберите УИКи"
            />
          </div>
        </div>

        <Button onClick={handleCreate} className="mt-3">
          Добавить
        </Button>
      </Card>

      <h1 className="text-lg font-semibold mb-4">Список агитаторов</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Фамилия</th>
            <th className="border p-2">Имя</th>
            <th className="border p-2">Отчество</th>
            <th className="border p-2">Телефон</th>
            <th className="border p-2">PIN</th>
            <th className="border p-2">Роль</th>
            <th className="border p-2">УИК</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {editableUsers.map((user) => (
            <tr key={user.id} className="border-b">
              {user.isEditing ? (
                <>
                  <td className="p-2">
                    <Input
                      value={user.lastName}
                      onChange={(e) =>
                        handleChange(user.id, "lastName", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={user.firstName}
                      onChange={(e) =>
                        handleChange(user.id, "firstName", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={user.middleName || ""}
                      onChange={(e) =>
                        handleChange(user.id, "middleName", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={user.phone || ""}
                      onChange={(e) =>
                        handleChange(user.id, "phone", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={user.pin || ""}
                      onChange={(e) =>
                        handleChange(user.id, "pin", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.uiks?.map((i) => (
                      <span key={i.id}>{i.uikCode}</span>
                  ))}</td>
                  <td className="p-2 flex gap-2">
                    <Button onClick={() => handleSave(user)}>Сохранить</Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        setEditableUsers((prev) =>
                          prev.map((u) =>
                            u.id === user.id ? { ...u, isEditing: false } : u
                          )
                        )
                      }
                    >
                      Отмена
                    </Button>
                  </td>
                </>
              ) : (
                  <>
                      <td className="p-2">{user.lastName}</td>
                      <td className="p-2">{user.firstName}</td>
                      <td className="p-2">{user.middleName}</td>
                      <td className="p-2">{user.phone}</td>
                      <td className="p-2">{user.pin}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2">{user.uiks?.map((i) => (
                          <span key={i.id}>{i.uikCode},</span>
                      ))}</td>
                      <td className="p-2 flex gap-2">
                          <Button
                              onClick={() =>
                                  setEditableUsers((prev) =>
                                      prev.map((u) =>
                                          u.id === user.id ? {...u, isEditing: true} : u
                                      )
                                  )
                              }
                          >
                              Редактировать
                          </Button>
                          <Button
                              variant="destructive"
                              onClick={() => handleDelete(user.id)}
                          >
                              Удалить
                          </Button>
                      </td>
                  </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
