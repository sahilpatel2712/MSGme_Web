import { useAppSelector } from "@/lib/redux/hooks";
import { DEFAULT_PROFILE_IMG } from "@/utils/data";
import { EditIcon } from "@/utils/svgs";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";

interface ProfileData {
  username: string;
  avatar: string | { url: string };
}

const ProfileSection = () => {
  const router = useRouter();
  const data: ProfileData = useAppSelector((state) => state.profile);
  const avatarSrc =
    typeof data.avatar === "string"
      ? data.avatar
      : data.avatar?.url || DEFAULT_PROFILE_IMG;

  return (
    <section className="w-full flex justify-between items-center p-4 h-[100px] text-black dark:text-white bg-white dark:bg-customGrey-black border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 w-[95%]">
        <CldImage
          width={60}
          height={60}
          src={avatarSrc || DEFAULT_PROFILE_IMG}
          alt="profile image"
          className="rounded-full aspect-square object-contain"
        />
        <p className="text-[20px] font-semibold">{data.username}</p>
      </div>
      <div className="w-[5%]">
        <button
          className="text-gray-400 dark:text-gray-50"
          onClick={() => router.push("/chat/settings/edit-profile")}
        >
          {EditIcon()}
        </button>
      </div>
    </section>
  );
};

export default ProfileSection;
