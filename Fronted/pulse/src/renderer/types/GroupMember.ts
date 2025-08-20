export interface GroupMember {
  groupId: string;
  userId: string;
  role: "admin" | "member";
  joinedAt: string;
  user: {
    id: string;
    display_name: string;
    profile_picture: string | null;
  };
}
