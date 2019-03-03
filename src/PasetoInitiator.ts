import { EventEmitter } from 'events';
import { PasetoFactory } from './PasetoFactory';
import { IProtocol } from 'paseto.js';
import { PasetoPublic } from './PasetoPublic';
import { PasetoPrivate } from './pasetoPrivate';
import { PasetoLocal } from './PasetoLocal';
import { PasetoVersion } from './PasetoVersion';

type Keys = {public?: PasetoPublic<IProtocol>,private?:PasetoPrivate<IProtocol>,local?: PasetoLocal<IProtocol>};

type FactoryFunc = (factory: PasetoFactory<IProtocol>) => Promise<Keys>;

const eventListener = new EventEmitter()
const factory: Map<string|symbol, {version: PasetoVersion, factoryFunc: FactoryFunc}> = new Map();
const instances: Map<string|symbol, Keys> = new Map();
const instantiationQueu: Set<string|symbol> = new Set();

const factories = {
    v1: PasetoFactory.createInstance('v1'),
    v2: PasetoFactory.createInstance('v2'),
};

export const addInstanceFactory = (name: string|symbol, factoryFunc: FactoryFunc, version?: PasetoVersion): void => {
    factory.set(name, {
        version: version ? version : PasetoVersion.v2,
        factoryFunc
    });
};

export const getInstance = (name: string|symbol): Promise<Keys> => {
    const instance = instances.get(name);
    if (instance) {
        return Promise.resolve(instance);
    }
    const factoryInfos = factory.get(name);
    if (!factoryInfos) {
        throw new Error('Unknown instance : ' + name.toString());
    }
    if (!instantiationQueu.has(name)) {
        instantiationQueu.add(name);
        return factoryInfos.factoryFunc(factories[factoryInfos.version])
        .then(paseto => {
            if (paseto.private && paseto.private.hasPublicKey() && !paseto.public) {
                paseto.public = new PasetoPublic(
                    PasetoFactory.getVersion(factoryInfos.version),
                    paseto.private.publicKey()!
                );
            }
            instances.set(name, paseto);
            eventListener.emit(name, paseto);
            return paseto;
        });
    }
    return new Promise((resolve) => {
        eventListener.once(name, resolve);
    });
};
