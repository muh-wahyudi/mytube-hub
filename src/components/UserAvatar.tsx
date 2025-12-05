interface UserAvatarProps {
  avatar: string | null;
  channelName: string;
  bgColor: string;
  textColor: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl'
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const UserAvatar = ({ avatar, channelName, bgColor, textColor, size = 'md', className = '' }: UserAvatarProps) => {
  if (avatar) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
        <img src={avatar} alt={channelName} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {getInitials(channelName)}
    </div>
  );
};

export default UserAvatar;
