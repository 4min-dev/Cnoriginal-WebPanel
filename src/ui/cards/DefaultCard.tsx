const DefaultCard: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={`flex flex-col p-[20px] bg-white border border-[#F3F3F3] rounded-[24px] shadow-[0_0_26px_0_rgba(15,15,43,0.05)] ${className}`}
    >
      {children}
    </div>
  );
};

export default DefaultCard;
