import clsx from "clsx";

const Sparkles = ({ className }: { className?: string }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 1000 1000"
      enableBackground="new 0 0 1000 1000"
      xmlSpace="preserve"
      className={clsx("h-6 w-6 fill-[#F8CD7B]", className)}
    >
      <g>
        <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
          <path d="M4942.8,4992.4c-18.4-10.2-51-198-98-555.3c-136.8-1051.5-247-1619-408.3-2098.8C4185.4,1593,3817.9,1150,3195.2,843.7C2692.9,594.7,2013,439.5,673.7,265.9C136.7,194.5,100,186.3,100,110.8C100,37.3,136.7,25,520.6-24C2521.4-277.1,3278.9-516,3826-1063.2c534.9-534.9,771.7-1269.9,1018.8-3152.3c71.5-537,79.6-573.7,155.2-573.7s85.8,36.7,145,502.2c249.1,1943.7,483.9,2680.7,1029,3223.8C6721.1-514,7476.5-277.1,9479.4-24C9863.3,25,9900,37.3,9900,110.8c0,75.5-36.7,83.7-573.7,155.2c-1039.2,134.8-1596.6,243-2060,396.1c-767.7,251.1-1216.8,614.5-1525.1,1235.2C5477.8,2426,5328.7,3079.4,5145,4508.5c-40.8,310.3-69.4,473.7-87.8,483.9C5022.5,5014.9,4977.5,5014.9,4942.8,4992.4z" />
        </g>
      </g>
    </svg>
  );
};

export default Sparkles;
