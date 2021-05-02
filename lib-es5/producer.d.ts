import { SymLinks, Target } from './types';
import { Stripe } from './packer';
import { CompressType } from './compress_type';
interface ProducerOptions {
    backpack: {
        entrypoint: string;
        stripes: Stripe[];
        prelude: string;
    };
    bakes: string[];
    slash: string;
    target: Target;
    symLinks: SymLinks;
    doCompress: CompressType;
}
export default function producer({ backpack, bakes, slash, target, symLinks, doCompress }: ProducerOptions): Promise<void>;
export {};
//# sourceMappingURL=producer.d.ts.map