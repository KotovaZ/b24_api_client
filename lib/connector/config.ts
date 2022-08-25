type ConfigProps = {
    portal: string;
    [key: number]: string | number;
}

export interface IConfig {
    getPortal(): string;
    getApiPath(): string;
    setProps(props: ConfigProps): void;
    getProps(): ConfigProps;
}

export abstract class BaseConfig implements IConfig {
    protected props: ConfigProps;
    public getPortal(): string {
        return this.props.portal;
    }

    public setProps(props: ConfigProps): void {
        this.props = props;
    }

    public getProps(): ConfigProps {
        return this.props;
    }

    abstract getApiPath(): string;
}

