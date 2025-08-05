import { redirect } from "next/navigation";
import { getUserById } from "@/lib/queries";
import { auth } from "@/auth";
import UserProfileScreen from "./user-profile-screen";

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const currentLoggedInUser = await getUserById(session.user.id!);

  if (!currentLoggedInUser) {
    redirect("/login");
  }

  return (
    <div>
      <UserProfileScreen currentLoggedInUser={currentLoggedInUser} />
    </div>
  );
};

export default UserProfilePage;
