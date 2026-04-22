import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { isWeb } from '@gluestack-ui/utils/nativewind-utils';

const captionTableStyle = isWeb ? 'caption-bottom' : '';

export const tableStyle = tva({
  base: `table border-collapse border-collapse w-full`,
});

export const tableHeaderStyle = tva({
  base: '',
});

export const tableBodyStyle = tva({
  base: '',
});

export const tableFooterStyle = tva({
  base: '',
});

export const tableHeadStyle = tva({
  base: 'flex-1 px-3 py-2 text-center font-bold text-[13px] leading-[18px] text-[#06392F] font-roboto',
});

export const tableRowStyleStyle = tva({
  base: 'border-0 border-b border-solid border-outline-200 bg-transparent',
  variants: {
    isHeaderRow: {
      true: '',
    },
    isFooterRow: {
      true: 'border-b-0 ',
    },
  },
});

export const tableDataStyle = tva({
  base: 'flex-1 px-3 py-2 text-center text-[13px] font-medium leading-[18px] text-black font-roboto',
});

export const tableCaptionStyle = tva({
  base: `${captionTableStyle} px-3 py-2 text-[13px] font-normal leading-[18px] text-typography-800 bg-background-50 font-roboto`,
});
