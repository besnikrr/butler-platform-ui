import * as yup from "yup";
import { Address, BaseEntity, Coordinates, DeleteEntityInput, BaseFilter, PrimaryContact } from "../base";
interface Hub extends BaseEntity {
    id?: string;
    name: string;
    city_id: string;
    city: ReferenceEntity;
    address: Address;
    primary_contact: PrimaryContact;
    active: boolean;
    tax: {
        percentage: number;
    };
    coordinates?: Coordinates;
    integration_configs: {
        quick_books: {
            class: string;
        };
        expeditor_app: {
            enabled: boolean;
        };
        next_move_app: {
            enabled: boolean;
        };
    };
    aggregates: {
        count_hotels: number;
    };
}
interface ReferenceEntity {
    id: string;
    name: string;
}
interface CreateHubInput {
    name: string;
    primary_contact: PrimaryContact;
    address: Address;
    coordinates?: Coordinates;
    tax: {
        percentage: number;
    };
    city_id: string;
    city: ReferenceEntity;
    active: boolean;
    integration_configs: {
        quick_books: {
            class: string;
        };
        expeditor_app: {
            enabled: boolean;
        };
        next_move_app: {
            enabled: boolean;
        };
    };
}
declare const createHubValidator: any;
interface UpdateHubInput {
    name: string;
    city_id: string;
    address: Address;
    primary_contact: PrimaryContact;
    active: boolean;
    tax: {
        percentage: number;
    };
    coordinates: Coordinates;
    integration_configs: {
        quick_books: {
            class: string;
        };
        expeditor_app: {
            enabled: boolean;
        };
        next_move_app: {
            enabled: boolean;
        };
    };
}
interface PatchHubInput {
    name?: string;
    city_id?: string;
    address?: Address;
    primary_contact?: PrimaryContact;
    active?: boolean;
    tax?: {
        percentage?: number;
    };
    coordinates?: Coordinates;
    integration_configs?: {
        quick_books?: {
            class: string;
        };
        expeditor_app?: {
            enabled: boolean;
        };
        next_move_app?: {
            enabled: boolean;
        };
    };
}
declare const patchHubValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city: any;
    address: any;
    primary_contact: any;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    tax: any;
    coordinates: any;
    integration_configs: any;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city: any;
    address: any;
    primary_contact: any;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    tax: any;
    coordinates: any;
    integration_configs: any;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    city: any;
    address: any;
    primary_contact: any;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    tax: any;
    coordinates: any;
    integration_configs: any;
}>>>;
declare const updateHubValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    city_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    address: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    primary_contact: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    tax: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>>;
    coordinates: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>>;
    integration_configs: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>>>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    city_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    address: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    primary_contact: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    tax: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>>;
    coordinates: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>>;
    integration_configs: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>>>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    city_id: yup.default<string, import("yup/lib/types").AnyObject, string>;
    address: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        city: yup.default<string, import("yup/lib/types").AnyObject, string>;
        country: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line1: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        line2: yup.default<string, import("yup/lib/types").AnyObject, string>;
        zip_code: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        state: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    primary_contact: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        email: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
        phone: import("yup/lib/string").RequiredStringSchema<string, import("yup/lib/types").AnyObject>;
    }>>>;
    active: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    tax: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        percentage: yup.NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>>;
    coordinates: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        latitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
        longitude: yup.default<string, import("yup/lib/types").AnyObject, string>;
    }>>>;
    integration_configs: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
        quick_books: any;
        expeditor_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
        next_move_app: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
            enabled: yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
        }>>>;
    }>>>;
}>>>;
declare type DeleteHubInput = DeleteEntityInput;
declare const deleteHubValidator: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    id: yup.default<string, import("yup/lib/types").AnyObject, string>;
}>>>;
interface HubFilter extends BaseFilter {
    city_ids?: string[];
    name?: string;
    statuses?: string[];
}
declare enum HUB_EVENT {
    CREATED = "HUB_CREATED",
    UPDATED = "HUB_UPDATED",
    OMS_CREATED = "OMS_CREATED",
    OMS_UPDATED = "OMS_UPDATED",
    DELETED = "HUB_DELETED",
    DEACTIVATED = "HUB_DEACTIVATED"
}
export { Hub, CreateHubInput, UpdateHubInput, DeleteHubInput, PatchHubInput, ReferenceEntity, HubFilter, createHubValidator, updateHubValidator, deleteHubValidator, patchHubValidator, HUB_EVENT, };
