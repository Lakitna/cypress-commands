import './generic';
import './attribute';
import './then';
import './text';
import './to';

/// <reference types="cypress" />

// TODO: How to add to the Cyress config types
declare namespace Cypress {
    interface ResolvedConfigOptions<ComponentDevServerOpts = any> {
        requestBaseUrl: string | null;
    }
}
