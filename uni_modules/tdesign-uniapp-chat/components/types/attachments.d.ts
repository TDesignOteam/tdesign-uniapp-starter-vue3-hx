import type { TransformEventHandlers, ExtractNonOnProps } from '../../../tdesign-uniapp/components/common/common';
import type { TdAttachmentsProps } from '../attachments/type';

export type AttachmentsProps = ExtractNonOnProps<TdAttachmentsProps>;
export type AttachmentsEmits = TransformEventHandlers<TdAttachmentsProps, true>;
declare const AttachmentsComponent: import('vue').DefineComponent<AttachmentsProps, {}, {}, {}, {}, {}, {}, AttachmentsEmits, any>;
export default AttachmentsComponent;
