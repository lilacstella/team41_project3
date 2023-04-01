from typing import Dict


def example_get(args: Dict[str, str]) -> Dict[str, str]:
    response = {'concat': args.get('test1') + args.get('test2'), 'ps': 'hi there'}
    return response


def example_post(data):
    return {'message': f"logging in with {data}"}
